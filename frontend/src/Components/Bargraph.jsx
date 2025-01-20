import { Bar } from "react-chartjs-2";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
)

export default function Bargraph({pos,neg}){
    // console.log(pos,neg);
    const option = {};
    const data = {
        labels:["Positive","Negative"],
        datasets:[
            {
                data:[pos,neg],
                backgroundColor:['rgba(0, 0, 0, 0.19)'],
                borderWidth:1,
                barThickness: 140,
            }
        ]
    };
    return <Bar options={option} data={data}/>
}