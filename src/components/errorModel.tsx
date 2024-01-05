import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ErrorModel({
  // tittle,
  visible,
  description,
  onClose,
}: {
  // tittle: string;
  visible?: boolean;
  description?: string;
  onClose: () => void;
}) {
  const theme = useTheme();
  return (
    <>
      <Modal
        backdrop={"blur"}
        isOpen={visible}
        onClose={onClose}
        radius="sm"
        classNames={{
          body: "py-6",
          backdrop: "backdrop-opacity-40",
          base: "border-[red] bg-[white] text-[#a8b0d3] dark:bg-dark",
          header: "border-b-[1px] border-[red]",
        }}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1 self-center"
                style={{ color: "red" }}
              >
                {"ERROR"}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-1 self-center">
                <p style={{ color: "red" }}>
                  {description &&
                    description.charAt(0).toUpperCase() + description.slice(1)}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
