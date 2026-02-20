package com.fruitshop.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "email_logs")
public class EmailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id")
    private Integer emailId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "email_type", length = 50)
    private String emailType;

    @Column(length = 200)
    private String subject;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    public enum EmailStatus {
        SENT, FAILED
    }
}
