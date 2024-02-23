
type Props = {
    selectedPrice?: number;
    onChange:(value?:number) => void
}


const PriceFilter = ({selectedPrice,onChange}:Props) => {
  return (
    <div>
        <h4 className="text-base font-bold mb-2">Max Price</h4>
        <select className="p-2 border rounded-md w-full" value={selectedPrice} 
         onChange={(event)=>onChange(event.target.value ? parseInt(event.target.value) : undefined)}
        >
            <option value="">Select Max Price</option>
            {[500,700,1000,2000,5000].map((price)=>(
                <option value={price} key={price}>{price}</option>
            ))}
        </select>
    </div>
  )
}

export default PriceFilter