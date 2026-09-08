import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const RerouteDialog = ({ isOpen, onClose, onConfirm, isCalculating = false }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Request AI Dynamic Reroute"
      description="The AI routing engine will evaluate live traffic congestion, waterlogging telemetry, and signal statuses to compute an optimal bypass."
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Real-time traffic sensors indicate rising congestion on the primary route (+7m delay projected).
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isCalculating}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isCalculating}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Compute & Dispatch Dynamic Reroute
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default RerouteDialog;
