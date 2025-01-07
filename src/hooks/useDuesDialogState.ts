import { useState } from "react";
import { DueTransaction } from "@/types/dues";

export const useDuesDialogState = () => {
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return {
    showPartialDialog,
    setShowPartialDialog,
    showPaymentSourceDialog,
    setShowPaymentSourceDialog,
    showExcuseDialog,
    setShowExcuseDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditDialog,
    setShowEditDialog,
    selectedTransaction,
    setSelectedTransaction,
    isDropdownOpen,
    setIsDropdownOpen,
  };
};