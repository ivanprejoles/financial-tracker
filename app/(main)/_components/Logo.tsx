import Image from "next/image";

const Logo = () => {
    return (  
        <Image
            src='/images/logo.png'
            alt="Logo"
            width={60}
            height={60}
            className="hover:cursor-pointer"
            onClick={() => {}}
        />
    );
}
 
export default Logo;