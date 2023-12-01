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
    footerButton = true,
}: {
    title: string;
    body: React.ReactNode;
    isOpen: boolean;
    onClose?: () => void;
    footerButton?: boolean;
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
                        {footerButton ? (
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    OK
                                </Button>
                            </ModalFooter>
                        ) : null}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
