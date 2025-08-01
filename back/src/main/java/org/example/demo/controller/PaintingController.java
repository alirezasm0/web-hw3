package org.example.demo.controller;

import org.example.demo.dto.PaintingUpdateRequest;
import org.example.demo.model.Painting;
import org.example.demo.model.User;
import org.example.demo.repository.PaintingRepository;
import org.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PaintingController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaintingRepository paintingRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{userId}/paintings")
    public ResponseEntity<List<Painting>> getPaintingsByUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paintingRepository.findByUserId(userId));
    }

    @PostMapping("/users/{userId}/paintings")
    public ResponseEntity<Painting> createPainting(@PathVariable Long userId, @RequestBody PaintingUpdateRequest request) {
        return userRepository.findById(userId).map(user -> {
            Painting newPainting = new Painting(null, request.getTitle(), request.getShapes(), user);
            paintingRepository.save(newPainting);
            return ResponseEntity.ok(newPainting);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/paintings/{paintingId}")
    public ResponseEntity<Painting> updatePainting(@PathVariable Long paintingId, @RequestBody PaintingUpdateRequest request) {
        return paintingRepository.findById(paintingId).map(painting -> {
            painting.setTitle(request.getTitle());
            painting.setShapes(request.getShapes());
            paintingRepository.save(painting);
            return ResponseEntity.ok(painting);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/paintings/{paintingId}")
    public ResponseEntity<Void> deletePainting(@PathVariable Long paintingId) {
        if (!paintingRepository.existsById(paintingId)) {
            return ResponseEntity.notFound().build();
        }
        paintingRepository.deleteById(paintingId);
        return ResponseEntity.noContent().build();
    }
}