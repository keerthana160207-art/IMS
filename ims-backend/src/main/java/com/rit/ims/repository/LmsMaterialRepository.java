package com.rit.ims.repository;

import com.rit.ims.entity.LmsMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LmsMaterialRepository extends JpaRepository<LmsMaterial, Long> {
    List<LmsMaterial> findByDepartmentAndSection(String department, String section);
    List<LmsMaterial> findBySubjectAndDepartmentAndSection(String subject, String department, String section);
}
