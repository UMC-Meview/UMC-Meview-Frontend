import { useState, useEffect } from "react";
import pencilIcon from "../../assets/Pencil.svg";

interface EditableTextProps {
    value: string;
    onSave: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    showEditIcon?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    iconPosition?: 'inline' | 'end';
    editMode?: 'nickname' | 'description';
}

const EditableText = ({
    value,
    onSave,
    placeholder = "",
    className = "",
    inputClassName = "",
    showEditIcon = true,
    autoFocus = true,
    maxLength,
    iconPosition = 'inline',
    editMode = 'description'
}: EditableTextProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    useEffect(() => setEditValue(value), [value]);

    const handleEdit = () => {
        setEditValue("");
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onSave(editValue);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (isEditing) {
                setEditValue(value);
                setIsEditing(false);
            }
        }, 100);
    };

    const renderEditIcon = (size: string) => (
        <button type="button" onClick={handleEdit} className="flex items-center">
            <img src={pencilIcon} alt="편집" className={size} />
        </button>
    );

    if (isEditing) {
        const inputWidth = editMode === 'nickname' ? 'w-24' : 'w-[160px]';
        
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    className={`bg-transparent border-b border-[#FF774C] focus:outline-none ${inputWidth} ${inputClassName}`}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    maxLength={maxLength}
                />
                <button
                    type="button"
                    onClick={handleSave}
                    className="text-sm text-[#FF774C] font-medium cursor-pointer whitespace-nowrap"
                >
                    저장
                </button>
            </div>
        );
    }

    return (
        <div className={`flex items-center ${className}`}>
            {iconPosition === 'inline' ? (
                <>
                    <span className="flex items-center">{value}</span>
                    {showEditIcon && <div className="ml-2">{renderEditIcon("w-[21px] h-[21px]")}</div>}
                </>
            ) : (
                <div className="flex-1 relative">
                    <span className="block w-full pr-8">{value || placeholder}</span>
                    {showEditIcon && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            {renderEditIcon("w-4 h-4")}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditableText; 