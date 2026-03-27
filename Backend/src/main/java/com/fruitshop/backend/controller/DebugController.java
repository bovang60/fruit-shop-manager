package com.fruitshop.backend.controller;

import com.fruitshop.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.PrintWriter;
import java.io.StringWriter;

@RestController
@RequestMapping("/api/debug-cart")
@RequiredArgsConstructor
public class DebugController {
    private final CartService cartService;

    @GetMapping
    public String debugCart(@RequestParam Integer userId) {
        try {
            cartService.getCart(userId);
            return "SUCCESS";
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            return sw.toString();
        }
    }
}
