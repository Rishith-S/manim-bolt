export default function InputBox({ label, type, value, setValue }: { label: string, type: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>> }) {
    return <div>
        <label className="block text-white text-sm mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={label}
            className="w-full bg-gray-75 border border-gray-25 rounded-lg px-3 py-2 text-white placeholder-gray-200/65 focus:outline-none focus:border-gray-400"
        />
    </div>
}