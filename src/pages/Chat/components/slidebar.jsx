

const Slidebar = () => {
    return(
        <div className="flex flex-col shadow-lg shadow-gray-500 rounded-lg w-1/3  h-full gap-10">
            <h4 className="text-5xl border-b-2 border-gray-500 flex justify-center pb-5">
                Users
            </h4>
            <ul className="flex flex-wrap gap-5 text-2xl items-start px-2">
                <li className="pl-2 pr-3 py-1 shadow-gray-400 rounded-lg shadow-sm">Cyber</li>
                <li className="pl-2 pr-3 py-1 shadow-gray-400 rounded-lg shadow-sm">xasdasda</li>
                <li className="pl-2 pr-3 py-1 shadow-gray-400 rounded-lg shadow-sm">xasdasda</li>
                <li className="pl-2 pr-3 py-1 shadow-gray-400 rounded-lg shadow-sm">xasdasdasd</li>
            </ul>
        </div>
    )
}

export default Slidebar;