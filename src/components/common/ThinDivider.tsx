interface ThinDividerProps {
    className?: string;
    width?: string;
}

const ThinDivider = ({
    className = "",
    width = "360px",
}: ThinDividerProps) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className={`h-[1px] bg-[#D9D9D9]`} style={{ width }}></div>
        </div>
    );
};

export default ThinDivider; 