import React from "react";
import NoticeClientPage from "../client/NoticeClientPage";
import { MarketType } from "@/types/marketType";
import { fetchServerNotice } from "../api/serverDataFetch";
import "./NoticeServerPage.css";

interface NoticeServerProps {
  initialMarketType: MarketType;
}

const NoticeServerPage = async ({ initialMarketType }: NoticeServerProps) => {
  try {
    const initialNoticeData = await fetchServerNotice({
      marketType: initialMarketType,
      page: 0,
      size: 15,
    });

    // 서버 데이터 로딩 실패시 클라이언트 컴포넌트 단에서 실패에 따른 화면 처리
    if (!initialNoticeData.success) {
      const errorMessage =
        typeof initialNoticeData.error === "string"
          ? initialNoticeData.error
          : "공지사항을 불러오는데 실패했습니다.";

      console.error(
        "❌ NoticeServerPage - 서버 데이터 로딩 실패:",
        errorMessage
      );
      return (
        <NoticeClientPage
          initialNoticeData={{
            data: {
              content: [],
              pageable: {
                sort: { sorted: false, unsorted: true, empty: true },
                pageNumber: 0,
                pageSize: 15,
                offset: 0,
                paged: true,
                unpaged: false,
              },
              totalElements: 0,
              totalPages: 0,
              last: true,
              first: true,
              number: 0,
              size: 15,
              numberOfElements: 0,
              sort: { sorted: false, unsorted: true, empty: true },
              empty: true,
            },
            absoluteUrl: "",
            marketType: initialMarketType,
          }}
        />
      );
    } else {
      return <NoticeClientPage initialNoticeData={initialNoticeData.data} />;
    }
  } catch (error) {
    console.error("💥 NoticeServerPage - 예상치 못한 오류:", error);

    // 예상치 못한 오류 발생 시에도 클라이언트 컴포넌트로 폴백
    return (
      <NoticeClientPage
        initialNoticeData={{
          data: {
            content: [],
            pageable: {
              sort: { sorted: false, unsorted: true, empty: true },
              pageNumber: 0,
              pageSize: 15,
              offset: 0,
              paged: true,
              unpaged: false,
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            first: true,
            number: 0,
            size: 15,
            numberOfElements: 0,
            sort: { sorted: false, unsorted: true, empty: true },
            empty: true,
          },
          absoluteUrl: "",
          marketType: initialMarketType,
        }}
      />
    );
  }
};

export default NoticeServerPage;
