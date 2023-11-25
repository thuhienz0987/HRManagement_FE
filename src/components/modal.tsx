import {
    Button,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Modal,
} from "@nextui-org/react";
import React from "react";

export default function BlurModal({
    title,
    body,
    isOpen,
    onClose,
}: {
    title: string;
    body: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {title}
                        </ModalHeader>
                        <ModalBody>{body}</ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                OK
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
