import ClipLoader from "react-spinners/ClipLoader";

export const Loader: React.FC = () => (
    <div className="flex justify-center items-center h-screen" >
        <ClipLoader color="white" size={100} />
    </div>
);
