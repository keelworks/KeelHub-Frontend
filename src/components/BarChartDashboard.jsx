import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../components/CardComponents"
import { fetchJobTitleWithCount } from "../services/fetchJobTitleWithCount"


const chartConfig = {
    count: {
        label: "Count",
        color: "#0A3FC1",
    },
}


export default function VolunteerCategoriesChart() {
    const [volunteerCount, setVolunteerCount] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1)
    const maxValue = Math.max(...chartData.map(item => item.active + item.inactive));
    const totalVolunteers = chartData.reduce((sum, item) => sum + item.active + item.inactive, 0);

    useEffect(() => {
        const loadData = async () => {
            try{
                const countData = await fetchJobTitleWithCount();
                console.log('Fetched Data:', countData);
                setVolunteerCount(countData);

                const fetchedData = Object.keys(countData.data).map(title => ({
                    category: title,
                    active: countData.data[title].active,
                    inactive: countData.data[title].inactive
                }));
                setChartData(fetchedData);
                console.log('Chart Data:', fetchedData);

            } catch (error) {
                console.error('Error fetching volunteer count:', error);
            }
        };
        loadData();
    },[])

    console.log('Total Volunteers:', totalVolunteers);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Volunteer Categories</CardTitle>
                <CardDescription>
                    <span className="text-xl">{totalVolunteers}</span>
                    <span className="text-gray-400 font-sans"> Total Volunteers</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex h-64 gap-3 overflow-x-auto items-end">
                    {chartData.map((item, index) => (
                        <div
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(-1)}
                            key={index}
                            className="flex flex-col h-full p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 justify-end hover:bg-gray-200 items-center"
                        >
                            {activeIndex === index ? (
                                <div className="flex flex-col items-center mb-1">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-[#CAD5F6] rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-400">Inactive</span>
                                    </div>
                                    <span className="mr-4 text-sm">{item.inactive}</span>
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-[#0A3FC1] rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-400">Active</span>
                                    </div>
                                    <span className="mr-4 text-sm">{item.active}</span>
                                </div>
                            ) : (
                                <span className={`text-xl mt-2 ${activeIndex !== index && "text-white"}`}>
                                    {item.active + item.inactive}
                                </span>
                            )}
                            <div
                                className="flex w-14 bg-[#CAD5F6] rounded-t"
                                style={{ height: `${(item.inactive / maxValue) * 100}%`, marginBottom: '10px' }}
                            ></div>
                            <div
                                className="flex w-14 bg-[#0A3FC1] rounded-t"
                                style={{ height: `${(item.active / maxValue) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-2 text-center">{item.category}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
