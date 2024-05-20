// import { SmileIcon } from "src/svgs";
import { Button, Input } from "@nextui-org/react";
import SendSharpIcon from '@mui/icons-material/SendSharp';

const ContentBottom = () => {
    return (
        <div className="flex flex-row dark:bg-dark bg-bg h-[60px] items-center gap-2 border-1 m-4">
            <Input
                className="h-[50px] overflow-hidden"
                placeholder="Aa"
                radius="full"
                size="sm"
                classNames={{
                    inputWrapper:
                        "data-[hover=true]:bg-default-100 min-h-[50px] pr-1 border-1 border-button",
                    base: ["h-[50px]"],
                }}
                endContent={
                    <button className="flex p-0 rounded-full btn-send">
                        <SendSharpIcon sx={{color: '#C89E31'}} />
                    </button>
                }
            />
        </div>
    );
};

export default ContentBottom;
