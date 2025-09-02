import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBoardData } from './lib/api';
import ClientPostPage from './ClientPostPage';
import { BoardData } from './types';
import StructuredData, {
  createArticleStructuredData,
} from '@/components/seo/StructuredData';

// 캐시 비허용 설정 - 게시글은 실시간으로 변경될 수 있음
export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const boardData = await getBoardData(params.id);

    if (!boardData) {
      return {
        title: '게시글을 찾을 수 없습니다 | KIMPRUN 커뮤니티',
        description: '요청하신 게시글을 찾을 수 없습니다.',
      };
    }

    // HTML 태그 제거
    const cleanContent = boardData.content
      .replace(/<[^>]*>/g, '')
      .substring(0, 160);
    const title = `${boardData.title} | KIMPRUN 커뮤니티`;
    const description =
      cleanContent || '김프런 커뮤니티에서 암호화폐 정보를 확인하세요.';

    return {
      title,
      description,
      keywords: [
        '암호화폐',
        '김프런',
        '커뮤니티',
        '비트코인',
        '이더리움',
        '투자정보',
        boardData.categoryName,
        boardData.memberNickName,
      ],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime:
          typeof boardData.createdAt === 'string'
            ? boardData.createdAt
            : boardData.createdAt.toISOString(),
        modifiedTime:
          typeof boardData.updatedAt === 'string'
            ? boardData.updatedAt
            : boardData.updatedAt.toISOString(),
        authors: [boardData.memberNickName],
        section: boardData.categoryName,
        tags: ['암호화폐', '김프런', boardData.categoryName],
        url: `https://kimprun.com/community/coin/post/${params.id}`,
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      alternates: {
        canonical: `/community/coin/post/${params.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {
      title: 'KIMPRUN 커뮤니티',
      description: '김프런 커뮤니티에서 암호화폐 정보를 확인하세요.',
    };
  }
}
const Page = async ({ params }: PageProps) => {
  try {
    const boardData: BoardData | null = await getBoardData(params.id);

    if (!boardData) {
      notFound();
    }


    const articleStructuredData = createArticleStructuredData(boardData);

    return (
      <>
        <StructuredData data={articleStructuredData} />
        <ClientPostPage boardData={boardData} />
      </>
    );
  } catch (error) {
    console.error('게시글 데이터 로딩 실패:', error);
    notFound();
  }
};

export default Page;
