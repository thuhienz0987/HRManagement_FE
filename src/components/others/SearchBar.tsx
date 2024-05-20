import { SearchIcon } from "src/svgs";
import { Input } from "@nextui-org/react";
import { FunctionComponent, useState, useEffect } from "react";
import { User } from "src/types/userType";
import { Listbox, ListboxItem, Avatar } from "@nextui-org/react";
import { format, parseISO, startOfToday } from "date-fns";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";

type Employee = User;

type TComponentProps = {};

const SearchBar: FunctionComponent<TComponentProps> = ({}) => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  //   const [isUser, setIsUser] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [available, setAvailable] = useState(false);

  const handleInputFocus = () => {
    setAvailable(true); // Khi input được focus, set trạng thái available thành true
  };

  const handleInputBlur = () => {
    setAvailable(false); // Khi input mất focus, set trạng thái available thành false
  };

  const rows = () => {
    let sortedEmp = employees;
    if (searchQuery) {
      sortedEmp = sortedEmp?.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sortedEmp;
  };
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await axiosPrivate.get<Employee[]>("/all-user", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        res.data.map((employee) => {
          employee.createdAt = format(
            parseISO(employee.createdAt),
            "dd/MM/yyyy"
          );
        });
        setEmployees(res.data);
        console.log(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getEmployees();
  }, []);

  return (
    <div className="w-full h-[36px] px-4 mb-2">
      <Input
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleInputFocus} // Khi input được focus, gọi handleInputFocus
        onBlur={handleInputBlur} // Khi input mất focus, gọi handleInputBlur
        isClearable
        size="sm"
        radius="full"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
            "h-full",
          ],
          base: "h-full",
        }}
        placeholder="Type to search..."
        startContent={<SearchIcon />}
      />
      {available && rows() && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-white dark:bg-bg_dark border border-gray-300 rounded-lg overflow-y-auto z-10">
          <Listbox
            classNames={{
              base: "max-w-full",
              list: "max-h-[300px] w-full overflow-y-scroll",
            }}
            items={rows()}
            label="Assigned to"
            selectionMode="single"
            variant="flat"
          >
            {(item) => (
              <ListboxItem key={item._id} textValue={item.name}>
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={item.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.avatarImage}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{item.name}</span>
                    <span className="text-tiny text-default-400">
                      {item.code}
                    </span>
                  </div>
                </div>
              </ListboxItem>
            )}
          </Listbox>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
