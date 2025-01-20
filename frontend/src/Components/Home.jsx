import React from "react";
import axios from "axios";
import Bargraph from "./Bargraph";

export default function Home(){

    const [text,setText] = React.useState("")
    const [res,setRes] = React.useState("");
    const[loader,setLoader] = React.useState(false);

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const str = text.split(' ').join('')
        
        try{
            setRes("")
            setLoader(true)
            const result = await axios.post("http://127.0.0.1:5000/analyze_sentiment",{
                "keyword":'#'+str
            });
            setLoader(false)
            setRes({
                positive:result.data.positive,
                negative:result.data.negative,
                neg_tweet:result.data.negative_texts,
                pos_tweet:result.data.positive_texts
            });
            setText("")
        }catch(err){
            console.log(err.message);
        }
    }

    const handleChange = (e)=>{
        setText(e.target.value)
    }

    return (
        <>
            <div className="home w-full rounded-xl pt-5 pl-1 pr-5 py-5">
                <div className="left rounded-xl">
                    <form onSubmit={handleSubmit} className="form rounded-xl p-8" >
                        <label className="mb-6 text-md" htmlFor="keyword">Enter the keyword : </label>
                        <input onChange={handleChange} required className="rounded-lg h-12 p-2 mb-6" id="keyword" type="text" value={text} />
                        <button type="submit" className="bton bg-blue-500 text-white py-2 px-4 mb-1 w-[40%] rounded-lg">Submit</button>
                    </form>
                </div>
                <div className="right rounded-xl ml-6 p-6">
                    {res && ( 
                        <div className=" rightInside pt-10 mb-5">
                            <div className="graph ">
                                <Bargraph  pos={res.positive} neg = {res.negative}/>
                            </div>
                            <p className="title text-2xl mt-8 pl-5 p-[2%] mr-[auto]">Positive : </p>
                            {res.pos_tweet && res.pos_tweet.map((tweet,index)=>{
                                return <p className="tweet rounded-lg my-4" key={index}>{tweet}</p>
                            })}
                            <p className="title text-2xl mt-8 pl-5 p-[2%] mr-[auto]">Negative : </p>
                            {res.neg_tweet && res.neg_tweet.map((tweet,index)=>{
                                return <p className="tweet rounded-lg my-4" key={index}>{tweet}</p>
                            })}
                            <p className="temp rounded-lg my-4"></p>
                        </div>
                    )}
                    {loader && (
                        <div className="loader-container">
                            <div className="loader-wheel"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}