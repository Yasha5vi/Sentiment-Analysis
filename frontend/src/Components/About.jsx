import React from "react";

export default function About(){
    return (
        <>
        <div className="about px-1 pr-5 py-5 h-full w-full">
            <div className="about-left w-[80%] h-full rounded-xl p-8 pl-16 pt-16">
                <h1 className="text-3xl mb-4" >What is Sentiment Analysis?</h1>
                <p className="text-lg w-[80%] mb-20 text-justify" >Sentiment analysis is a 
                    natural language processing (NLP) task that determines the 
                    emotional tone of a text, such as positive, negative, or neutral. It is commonly 
                    used in applications like social media monitoring and customer feedback analysis 
                    to understand public opinion or emotions, helping organizations make data-driven decisions.</p>

                <h1 className="text-xl mb-4"  >Sentiment Analysis on Twitter Tweets</h1>
                <p className="text-lg w-[80%] text-justify" >For sentiment analysis on Twitter, the tweet 
                    text is first collected using an API, then preprocessed by removing unwanted elements. 
                    The text is tokenized and features are extracted using techniques like TF-IDF or word 
                    embeddings. The processed tweet is fed into a sentiment analysis model, which classifies 
                    it into positive, negative, or neutral. The result helps track sentiment across multiple 
                    tweets on specific topics.</p>
            </div>
            <div className="about-right w-[20%] h-full ml-6 rounded-xl"></div>
        </div>
        </>
    )
}