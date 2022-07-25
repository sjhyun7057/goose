package com.ssafy.api.request.article;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 작성 API ([POST] /api/v1/articles) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("ArticleRegisterPostRequest")
public class ArticleRegisterPostReq {

	@ApiModelProperty(name="유저 PK", example="user_pk")
	long user_pk;
	@ApiModelProperty(name="스터디 PK", example="study_pk")
	long study_pk;
	@ApiModelProperty(name="스터디 모집상태", example="article_state")
	String state;
	@ApiModelProperty(name="스터디 카테고리", example="article_category")
	String category;
	@ApiModelProperty(name="게시글 제목", example="article_title")
	String title;
	@ApiModelProperty(name="게시글 내용", example="article_content")
	String content;
	@ApiModelProperty(name="스터디 모집 인원", example="article_recruitment")
	int recruitment;
}