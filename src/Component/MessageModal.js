import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class MessageModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        const { MessageModal, set } = this.props.app;
        MessageModal.isOpen = !MessageModal.isOpen;
        set({ MessageModal });
    }

    render() {
        const { MessageModal } = this.props.app;
        return (
            <Modal isOpen={MessageModal.isOpen} className={this.props.className} toggle={MessageModal.done ? this.toggle : null}>
                <ModalHeader toggle={MessageModal.done ? this.toggle : null}>{MessageModal.title}</ModalHeader>
                <ModalBody>{MessageModal.message}</ModalBody>
                {
                    MessageModal.done ?
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Aceptar</Button>
                        </ModalFooter>
                        :
                        null
                }
            </Modal>
        );
    }
}

export default MessageModal;