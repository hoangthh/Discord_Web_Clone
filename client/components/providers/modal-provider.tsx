"use client";

import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteServerModal,
  EditChannelModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
} from "@/components/modals";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </>
  );
};
