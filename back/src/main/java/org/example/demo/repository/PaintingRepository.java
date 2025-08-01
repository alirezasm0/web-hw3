package org.example.demo.repository;

import org.example.demo.model.Painting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaintingRepository extends JpaRepository<Painting, Long> {
    List<Painting> findByUserId(Long userId);

    Optional<Painting> findById(Long paintingId);
}
