import { useLocalStorage } from "./useLocalStorage";

export function usePosition() {
    return useLocalStorage<string>("position", "left");
}
