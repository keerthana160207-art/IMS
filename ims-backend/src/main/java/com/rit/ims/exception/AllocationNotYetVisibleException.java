package com.rit.ims.exception;

import java.time.LocalDateTime;

public class AllocationNotYetVisibleException extends RuntimeException {
    private final LocalDateTime availableAt;
    private final int minutesBefore;

    public AllocationNotYetVisibleException(LocalDateTime availableAt, int minutesBefore) {
        super("Seat allocation not yet available");
        this.availableAt = availableAt;
        this.minutesBefore = minutesBefore;
    }

    public LocalDateTime getAvailableAt() { return availableAt; }

    public int getMinutesBefore() { return minutesBefore; }
}
