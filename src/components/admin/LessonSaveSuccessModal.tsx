import AdminSaveSuccessModal from "@/components/admin/AdminSaveSuccessModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LessonSaveSuccessModal({ open, onClose }: Props) {
  return (
    <AdminSaveSuccessModal
      open={open}
      titleId="lesson-save-success-title"
      title="Saved"
      subtitle="Changes applied"
      actionLabel="OK"
      onAction={onClose}
    />
  );
}
