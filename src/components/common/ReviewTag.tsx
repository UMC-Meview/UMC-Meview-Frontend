interface TagProps {
    text: string;
    className?: string;
}

const ReviewTag = ({ text, className = "" }: TagProps) => {
    return (
        <span
            className={`inline-block text-black text-xs rounded-full shadow ${className}`}
            style={{
                height: "23px",
                paddingTop: "3px",
                paddingBottom: "3px",
                paddingLeft: "8px",
                paddingRight: "8px",
            }}
        >
            {text}
        </span>
    );
};

export default ReviewTag;
