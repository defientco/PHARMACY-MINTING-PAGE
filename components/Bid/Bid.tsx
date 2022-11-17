export default function Bid({ colorScheme, initialBid, onChange }) {
    return (
        <div className={`text-[#f70500]  z-9 flex border border-red-500 col-start-1 col-end-3  w-full flex-row justify-self-end  focus-visible:ring-offset-[${colorScheme}`}>
            <div className="w-full">
            <label className="text-xl m-2" htmlFor="bid" >
                Your Bid
            </label>
             <input 
                onChange={onChange} 
                className="border w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                id="bid" 
                step={0.01}
                type="number" 
                placeholder={initialBid}
            />

            </div>
        </div>
    )
}