import Modal from "./Modal";
export default function ConfirmDialog({ text, busy, onConfirm, onCancel }) {
  return (
    <Modal title="Are you sure?">
      <p className="mb-4 text-sm">{text}</p>
      <div className="flex justify-end gap-2">
        <button className="btn-light" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn !bg-red-600" onClick={onConfirm} disabled={busy}>{busy ? "Deleting..." : "Delete"}</button>
      </div>
    </Modal>
  );
}
