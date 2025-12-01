import styles from "./Modal.module.css";
import { IoSaveOutline } from "react-icons/io5";

export const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
        <button
          className={styles.saveBtn}
          onClick={onClose}
          // evita el popup del sistema
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (e.pointerType === "touch" && e.pressure === 0) {
              // evita que el long-press sea detectado como acción especial
              e.preventDefault();
            }
          }}
        >
          <IoSaveOutline /> Guardar
        </button>
      </div>
    </div>
  );
};
