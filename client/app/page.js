import Found from "@/components/Found";
import Searching from "@/components/Searching";


export default function Home() {
    return (
        <div className="w-[80%] mx-auto grid md:grid-cols-1 lg:grid-cols-2 ">
            <div className="mt-8"> <Searching/></div>
            <div className="mt-8"> <Found/></div>
        </div>
    )
}   
