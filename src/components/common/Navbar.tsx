const Navbar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 shadow-lg bg-gradient-to-t from-[#FF774C] to-[#FF694F]">
            <div className="flex justify-between items-center p-4">
                <div className="flex space-x-4">
                    <button className="text-white font-bold">QR</button>
                    <button className="text-white font-bold">지도</button>
                    <button className="text-white font-bold">찜한가게</button>
                    <button className="text-white font-bold">프로필</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
