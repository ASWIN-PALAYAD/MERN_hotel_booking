import { hoteTypes } from "../config/hotel-options-config";

type Props = {
    selectedHotelTypes :  string[];
    onChange: (event:React.ChangeEvent<HTMLInputElement>) => void
}

const HotelTypeFilter = ({selectedHotelTypes,onChange}:Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
        <h4 className="text-base font-semibold mb-2">Hotel Types</h4>
        {hoteTypes.map((hotelType)=> (
            <label className="flex items-center space-x-2" key={hotelType}>
                <input type="checkbox" className="rounded" value={hotelType} checked={selectedHotelTypes.includes(hotelType)} 
                    onChange={onChange}
                />
                <span>{hotelType}</span>
            </label>
        ))}
    </div>
  )
}

export default HotelTypeFilter