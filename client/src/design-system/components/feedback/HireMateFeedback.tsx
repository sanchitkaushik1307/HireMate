import { Skeleton } from '../../primitives/Skeleton';
import { Dialog, type DialogProps } from '../../primitives/Dialog';
import { Drawer, type DrawerProps } from '../../primitives/Drawer';
import { useToast } from '../../primitives/Toast';

export const HireMateSkeleton = Skeleton;
export const HireMateDialog = Dialog;
export const HireMateDrawer = Drawer;
export { useToast as useHireMateToast };
export type { DialogProps as HireMateDialogProps, DrawerProps as HireMateDrawerProps };
