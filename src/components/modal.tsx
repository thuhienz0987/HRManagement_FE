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
    tittleStyle,
    isOpen,
    onClose,
    footerButton = true,
    size = "md",
    hideCloseButton = false,
}: {
    hideCloseButton?: boolean;
    title: React.ReactNode;
    body: React.ReactNode;
    tittleStyle?: string;
    isOpen: boolean;
    onClose?: () => void;
    footerButton?: boolean;
    size?:
        | "md"
        | "xs"
        | "sm"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "full"
        | undefined;
}) {
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            hideCloseButton={hideCloseButton}
            scrollBehavior="outside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={`flex flex-col gap-1 ${tittleStyle}`}>
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
