package com.ssafy.db.specification;

import org.springframework.data.jpa.domain.Specification;

import com.ssafy.db.entity.Article;

public class ArticleSpecification {
	
	public static Specification<Article> equalState(String state){
		return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("state"), state);
	}
	
	public static Specification<Article> equalCategory(String category){
		return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category"), category);
	}
	
	public static Specification<Article> equalTitle(String title){
		return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("title"), title);
	}

}