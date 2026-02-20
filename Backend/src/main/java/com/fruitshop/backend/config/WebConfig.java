package com.fruitshop.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.core.convert.converter.Converter;
import com.fruitshop.backend.model.User;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new Converter<String, User.Role>() {
            @Override
            public User.Role convert(String source) {
                return User.Role.fromString(source);
            }
        });
        
        registry.addConverter(new Converter<String, User.UserStatus>() {
            @Override
            public User.UserStatus convert(String source) {
                return User.UserStatus.fromString(source);
            }
        });
    }
}
