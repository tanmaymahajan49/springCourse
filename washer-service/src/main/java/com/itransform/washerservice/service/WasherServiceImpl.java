package com.itransform.washerservice.service;

import com.itransform.washerservice.dto.WasherDTO;
import com.itransform.washerservice.entity.Washer;
import com.itransform.washerservice.repository.WasherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WasherServiceImpl implements WasherService {

    private final WasherRepository washerRepository;

    public WasherServiceImpl(WasherRepository washerRepository) {
        this.washerRepository = washerRepository;
    }

    @Override
    public String registerWasher(WasherDTO dto) {
        Washer washer = Washer.builder()
                .name(dto.getName())
                .contactNumber(dto.getContactNumber())
                .email(dto.getEmail())
                .city(dto.getCity())
                .build();

        washerRepository.save(washer);
        return "Washer registered successfully!";
    }

    @Override
    public Washer getWasherById(Long id) {
        Optional<Washer> washer = washerRepository.findById(id);
        if (washer.isPresent()) {
            return washer.get();
        } else {
            throw new RuntimeException("Washer not found with ID: " + id);
        }
    }

    @Override
    public List<Washer> getAllWashers() {
        return washerRepository.findAll();
    }

    @Override
    public String updateWasher(Long id, WasherDTO dto) {
        Washer washer = getWasherById(id);
        washer.setName(dto.getName());
        washer.setContactNumber(dto.getContactNumber());
        washer.setEmail(dto.getEmail());
        washer.setCity(dto.getCity());

        washerRepository.save(washer);
        return "Washer updated successfully!";
    }

    @Override
    public String deleteWasher(Long id) {
        washerRepository.deleteById(id);
        return "Washer deleted successfully!";
    }
    
}
