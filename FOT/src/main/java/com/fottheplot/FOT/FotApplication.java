package com.fottheplot.FOT;

import com.fottheplot.FOT.entity.Role;
import com.fottheplot.FOT.repository.RoleRepository;
import com.fottheplot.FOT.service.DataSeederService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FotApplication {

	public static void main(String[] args) {
		SpringApplication.run(FotApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, DataSeederService dataSeederService) {
		return args -> {
			if (roleRepository.findByName("ROLE_USER").isEmpty()) {
				roleRepository.save(new Role(null, "ROLE_USER"));
			}
			if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
				roleRepository.save(new Role(null, "ROLE_ADMIN"));
			}
			dataSeederService.seedData();
		};
	}

}
