import IconAdd from "./icons/add";
import IconMenu from "./icons/menu";

type Props = {
    openSidebarClick: () => void;
    title: string;
    newChatClick: () => void;
}

export const Header = ({openSidebarClick, title, newChatClick}:Props) => {
    return(
        <header className="flex justify-between items-center w-full 
        border-b border-b-gray-600 p-2 text-white md:hidden">
            <div onClick={openSidebarClick}>
                <IconMenu width={24} height={24} />
            </div>

            <div className="mx-2 truncate">{title}</div>
            
            <div onClick={newChatClick}><IconAdd height={24} width={24} /></div>
        </header>
    );
}