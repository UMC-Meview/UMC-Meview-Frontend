import logoImage from "../../assets/Logo.svg";

const Logo: React.FC = () => {
    return (
        <div className="flex justify-center items-center mb-6">
            <img
                src={logoImage}
                alt="Meview Logo"
                className="w-24 h-24 object-contain"
            />
        </div>
    );
};

export default Logo;
