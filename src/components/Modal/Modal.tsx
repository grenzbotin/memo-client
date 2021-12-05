import { ReactNode } from "react";
import "./Modal.scss";

function Modal({
  id,
  modalHeadPicture,
  modalContent,
  modalActions,
}: {
  id: string;
  modalHeadPicture?: ReactNode;
  modalContent: ReactNode;
  modalActions: {
    secondary?: {
      action: (e: React.MouseEvent<HTMLElement>) => void;
      text: string;
    };
    primary: {
      action: (e: React.MouseEvent<HTMLElement>) => void;
      text: string;
      disabled?: boolean;
    };
  };
}) {
  return (
    <div id={id} className="modal">
      <div className="modal-box">
        {modalHeadPicture}
        <div className="modal-inner">
          <div className="modal-content">
            <div>{modalContent}</div>

            <div className="modal-actions">
              {modalActions.secondary && (
                <button
                  className="secondary"
                  onClick={modalActions.secondary.action}
                >
                  {modalActions.secondary.text}
                </button>
              )}
              <button
                disabled={modalActions.primary.disabled}
                onClick={modalActions.primary.action}
              >
                {modalActions.primary.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
