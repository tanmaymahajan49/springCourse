package com.itransform.washerservice.service;

import com.itransform.washerservice.dto.WasherDTO;
import com.itransform.washerservice.entity.Washer;

import java.util.List;

public interface WasherService {
    String registerWasher(WasherDTO washerDTO);
    Washer getWasherById(Long id);
    List<Washer> getAllWashers();
    String updateWasher(Long id, WasherDTO washerDTO);
    String deleteWasher(Long id);
}
