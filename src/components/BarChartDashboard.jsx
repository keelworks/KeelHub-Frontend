import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../components/CardComponents"

const chartData = [
    { category: "Program Manager", count: 45 },
    { category: "Software Engineer", count: 80 },
    { category: "Quality Assurance", count: 30 },
    { category: "Fundraising/Grant", count: 25 },
    { category: "Human Resources", count: 20 },
    { category: "Marketing", count: 35 },
    { category: "Data Analyst", count: 40 },
    { category: "Project Coordinator", count: 50 },
    { category: "Graphic Designer", count: 15 },
    { category: "Content Writer", count: 30 }
]

const chartConfig = {
    count: {
        label: "Count",
        color: "#0A3FC1",
    },
}

export default function VolunteerCategoriesChart() {
    const [activeIndex, setActiveIndex] = useState(-1)
    const maxValue = Math.max(...chartData.map(item => item.count));
    const totalVolunteers = chartData.reduce((sum, item) => sum + item.count, 0);

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
                <div className="flex h-64 gap-4 overflow-scroll items-end">
                    {chartData.map((item, index) => (
                        <div
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(-1)}
                            key={index}
                            className="flex flex-col h-full p-4 w-full justify-end hover:bg-gray-200 items-center"
                        >
                            <span className={`text-xl mt-2 ${activeIndex !== index && "text-white"}`}>{item.count}</span>
                            <div
                                className="flex w-14 bg-[#0A3FC1] rounded-t"
                                style={{ height: `${(item.count / maxValue) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-2 text-center">{item.category}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
