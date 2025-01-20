from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import pandas as pd
from nltk.stem import WordNetLemmatizer
import requests

app = Flask(__name__)

CORS(app)

emojis = {':)': 'smile', ':-)': 'smile', ';d': 'wink', ':-E': 'vampire', ':(': 'sad', 
          ':-(': 'sad', ':-<': 'sad', ':P': 'raspberry', ':O': 'surprised',
          ':-@': 'shocked', ':@': 'shocked',':-$': 'confused', ':\\': 'annoyed', 
          ':#': 'mute', ':X': 'mute', ':^)': 'smile', ':-&': 'confused', '$_$': 'greedy',
          '@@': 'eyeroll', ':-!': 'confused', ':-D': 'smile', ':-0': 'yell', 'O.o': 'confused',
          '<(-_-)>': 'robot', 'd[-_-]b': 'dj', ":'-)": 'sadsmile', ';)': 'wink', 
          ';-)': 'wink', 'O:-)': 'angel','O*-)': 'angel','(:-D': 'gossip', '=^.^=': 'cat'}


stopwordlist = ['a', 'about', 'above', 'after', 'again', 'ain', 'all', 'am', 'an',
             'and','any','are', 'as', 'at', 'be', 'because', 'been', 'before',
             'being', 'below', 'between','both', 'by', 'can', 'd', 'did', 'do',
             'does', 'doing', 'down', 'during', 'each','few', 'for', 'from', 
             'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here',
             'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
             'into','is', 'it', 'its', 'itself', 'just', 'll', 'm', 'ma',
             'me', 'more', 'most','my', 'myself', 'now', 'o', 'of', 'on', 'once',
             'only', 'or', 'other', 'our', 'ours','ourselves', 'out', 'own', 're',
             's', 'same', 'she', "shes", 'should', "shouldve",'so', 'some', 'such',
             't', 'than', 'that', "thatll", 'the', 'their', 'theirs', 'them',
             'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 
             'through', 'to', 'too','under', 'until', 'up', 've', 'very', 'was',
             'we', 'were', 'what', 'when', 'where','which','while', 'who', 'whom',
             'why', 'will', 'with', 'won', 'y', 'you', "youd","youll", "youre",
             "youve", 'your', 'yours', 'yourself', 'yourselves']


# Function to load models
def load_models():
    vectoriser_path = 'vectoriser-ngram-(1,2).pickle'
    lrmodel_path = 'lr.pickle'

    with open(vectoriser_path, 'rb') as file:
        vectoriser = pickle.load(file)
    with open(lrmodel_path, 'rb') as file:
        LRmodel = pickle.load(file)
    return vectoriser, LRmodel


# Function to preprocess the text
def preprocess(textdata):

    processedText = []
    wordLemm = WordNetLemmatizer()
    urlPattern = r"((http://)[^ ]*|(https://)[^ ]*|( www\.)[^ ]*)"
    userPattern = '@[^\s]+'
    alphaPattern = "[^a-zA-Z0-9]"
    sequencePattern = r"(.)\1\1+"
    seqReplacePattern = r"\1\1"

    for tweet in textdata:
        tweet = tweet.lower()
        # tweet = re.sub(urlPattern,' URL',tweet)
        for emoji in emojis.keys():
            tweet = tweet.replace(emoji, "EMOJI " + emojis[emoji])        
        tweet = re.sub(userPattern,' USER', tweet)        
        tweet = re.sub(alphaPattern, " ", tweet)
        tweet = re.sub(sequencePattern, seqReplacePattern, tweet)
        tweetwords = ''
        for word in tweet.split():
            if word not in stopwordlist:
                if len(word)>1:
                    word = wordLemm.lemmatize(word)
                    tweetwords += (word+' ')
        processedText.append(tweetwords)   
    return processedText


# Function to make predictions
def predict(vectoriser, model, text):
    textdata = vectoriser.transform(preprocess(text))
    sentiment = model.predict(textdata)
    data = [(text, pred) for text, pred in zip(text, sentiment)]
    df = pd.DataFrame(data, columns=['text', 'sentiment'])
    df['sentiment'] = df['sentiment'].replace([0, 1], ['Negative', 'Positive'])
    return df


def fetch_twitter_data(hashtag):
    url = f"https://twitter154.p.rapidapi.com/hashtag/hashtag"
    payload = {
        "hashtag": hashtag,
        "limit": 20,
        "section": "top",
        "language": "en"
    }
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": "15b6a1de15msh9a321f1f3a22b53p184441jsn6f7c191a28c0",
        "X-RapidAPI-Host": "twitter154.p.rapidapi.com"
    }
    try:
        response = requests.post(url, json=payload, headers=headers)                                                
        json_data = response.json()
        if "results" in json_data:
            return [tweet['text'] for tweet in json_data["results"]]
        else:
            print("No tweets found.")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Twitter data: {e}")
        return None


@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    keyword = data.get('keyword')
    
    print("Keyword : ",keyword)

    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400

    # Fetch tweets for the given hashtag
    texts = fetch_twitter_data(keyword)
    if texts:
        positive_texts = [] 
        negative_texts = []  
        total_positive_count = 0
        total_negative_count = 0
        vectoriser, LRmodel = load_models()
        
        # Predict sentiment for each tweet
        for text in texts:
            processed_text = preprocess([text])  
            df = predict(vectoriser, LRmodel, processed_text)
            sentiment = df['sentiment'].iloc[0]
            if sentiment == 'Positive':
                total_positive_count += 1
                positive_texts.append(processed_text)
            elif sentiment == 'Negative':
                total_negative_count += 1
                negative_texts.append(processed_text)

        total_texts = len(texts)
        total_positive_percentage = (total_positive_count / total_texts) * 100
        total_negative_percentage = (total_negative_count / total_texts) * 100

        return jsonify({
            'positive': total_positive_percentage,
            'negative': total_negative_percentage,
            'positive_texts': positive_texts,
            'negative_texts': negative_texts
        })
    else:
        return jsonify({"error": "No tweets found for the given hashtag."}), 404


if __name__ == '__main__':
    app.run(debug=True)
