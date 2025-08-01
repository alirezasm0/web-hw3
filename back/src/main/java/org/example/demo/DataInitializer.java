package org.example.demo;

import org.example.demo.model.Painting;
import org.example.demo.model.User;
import org.example.demo.repository.PaintingRepository;
import org.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaintingRepository paintingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {

            User user1 = new User(null, "Alireza", new ArrayList<>());
            User user2 = new User(null, "Ali", new ArrayList<>());

            userRepository.save(user1);
            userRepository.save(user2);

            Painting p1 = new Painting(null, "First Painting", "[{\"id\":1,\"type\":\"circle\",\"x\":100,\"y\":150}]", user1);
            Painting p2 = new Painting(null, "Second Painting", "[]", user1);

            paintingRepository.save(p1);
            paintingRepository.save(p2);

            System.out.println("Initial data created.");
        }
    }
}
