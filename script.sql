USE [master]
GO
/****** Object:  Database [CalenderAppDb]    Script Date: 17.08.2024 21:24:31 ******/
CREATE DATABASE [CalenderAppDb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CalenderAppDb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CalenderAppDb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'CalenderAppDb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CalenderAppDb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CalenderAppDb] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CalenderAppDb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CalenderAppDb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CalenderAppDb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CalenderAppDb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CalenderAppDb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CalenderAppDb] SET ARITHABORT OFF 
GO
ALTER DATABASE [CalenderAppDb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CalenderAppDb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CalenderAppDb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CalenderAppDb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CalenderAppDb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CalenderAppDb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CalenderAppDb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CalenderAppDb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CalenderAppDb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CalenderAppDb] SET  DISABLE_BROKER 
GO
ALTER DATABASE [CalenderAppDb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CalenderAppDb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CalenderAppDb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CalenderAppDb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CalenderAppDb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CalenderAppDb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CalenderAppDb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CalenderAppDb] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CalenderAppDb] SET  MULTI_USER 
GO
ALTER DATABASE [CalenderAppDb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CalenderAppDb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CalenderAppDb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CalenderAppDb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CalenderAppDb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CalenderAppDb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [CalenderAppDb] SET QUERY_STORE = ON
GO
ALTER DATABASE [CalenderAppDb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CalenderAppDb]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 17.08.2024 21:24:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Etkinliks]    Script Date: 17.08.2024 21:24:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Etkinliks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Baslik] [nvarchar](max) NOT NULL,
	[Aciklama] [nvarchar](max) NULL,
	[BaslangicTarihi] [datetime2](7) NOT NULL,
	[BitisTarihi] [datetime2](7) NOT NULL,
	[TekrarDurumu] [int] NOT NULL,
	[OlusturanKullaniciId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_Etkinliks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KullaniciEtkinliks]    Script Date: 17.08.2024 21:24:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KullaniciEtkinliks](
	[EtkinlikId] [int] NOT NULL,
	[KullaniciId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_KullaniciEtkinliks] PRIMARY KEY CLUSTERED 
(
	[KullaniciId] ASC,
	[EtkinlikId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Kullanicis]    Script Date: 17.08.2024 21:24:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Kullanicis](
	[Id] [nvarchar](450) NOT NULL,
	[KullaniciAdi] [nvarchar](450) NOT NULL,
	[Isim] [nvarchar](max) NOT NULL,
	[Soyisim] [nvarchar](max) NOT NULL,
	[KullaniciSifresi] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Kullanicis] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240523111052_mig_01', N'8.0.5')
GO
SET IDENTITY_INSERT [dbo].[Etkinliks] ON 

INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (175, N'deneme 1', N'deneme 1', CAST(N'2024-08-06T09:18:11.7040000' AS DateTime2), CAST(N'2024-08-06T10:18:11.7040000' AS DateTime2), 2, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (178, N'deneme 4', N'deneme 4', CAST(N'2024-08-14T10:20:06.0230000' AS DateTime2), CAST(N'2024-08-14T11:20:06.0230000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (179, N'deneme 5', N'deneme 5', CAST(N'2024-08-14T17:20:16.3000000' AS DateTime2), CAST(N'2024-08-16T18:20:16.3000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (180, N'deneme 3', N'deneme 3', CAST(N'2024-08-07T06:00:48.1000000' AS DateTime2), CAST(N'2024-08-07T07:00:48.1000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (181, N'deneme 6', N'deneme 6', CAST(N'2024-08-07T20:59:14.7000000' AS DateTime2), CAST(N'2024-08-07T21:59:14.7000000' AS DateTime2), 3, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (182, N'deneme 7', N'deneme 7', CAST(N'2024-08-24T15:59:14.0070000' AS DateTime2), CAST(N'2024-08-28T16:59:14.0000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (198, N'd1', N'd1', CAST(N'2024-08-08T00:20:12.0000000' AS DateTime2), CAST(N'2024-08-08T01:20:12.0000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (199, N'd3', N'd3', CAST(N'2024-08-08T19:20:12.0000000' AS DateTime2), CAST(N'2024-08-08T20:20:12.0000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (200, N'd2', N'd2', CAST(N'2024-08-07T11:19:41.3000000' AS DateTime2), CAST(N'2024-08-10T12:19:41.3000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (201, N'd4', N'd4', CAST(N'2024-08-09T01:19:41.3000000' AS DateTime2), CAST(N'2024-08-09T02:19:41.3000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (202, N'd5', N'd5', CAST(N'2024-08-09T21:23:41.3000000' AS DateTime2), CAST(N'2024-08-10T22:25:41.3000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (203, N'a1', N'a1', CAST(N'2024-08-01T11:19:41.3850000' AS DateTime2), CAST(N'2024-08-01T12:19:41.3850000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (204, N'a2', N'a2', CAST(N'2024-08-01T11:19:41.3850000' AS DateTime2), CAST(N'2024-08-01T12:19:41.3850000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (205, N'a3', N'a3', CAST(N'2024-08-01T04:19:41.3000000' AS DateTime2), CAST(N'2024-08-03T03:19:41.3000000' AS DateTime2), 0, N'2d8f5782-0df9-4c88-af81-83ad5d641249')
SET IDENTITY_INSERT [dbo].[Etkinliks] OFF
GO
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'1c27dd49-6346-4406-9787-4a2136ffb261', N'edam', N'edam', N'edam', N'QsnPwaMXpamUazOvB1UjN0GwC5Of0ztC52jTPCXUKtE=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'2d8f5782-0df9-4c88-af81-83ad5d641249', N'eda', N'eda', N'eda', N'UA4wchoHAv07kCR7KNNSNh990R3GlWe3TXfS4KRZX+g=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'8f960025-4879-4a28-9d3d-2c9c04d55e4f', N'nuri', N'nuri', N'nuri', N'tDDmQxmDzc4wRe/P9xT+dQES/9teVzV3D6rq2XN8e8k=')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Etkinliks_OlusturanKullaniciId]    Script Date: 17.08.2024 21:24:31 ******/
CREATE NONCLUSTERED INDEX [IX_Etkinliks_OlusturanKullaniciId] ON [dbo].[Etkinliks]
(
	[OlusturanKullaniciId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_KullaniciEtkinliks_EtkinlikId]    Script Date: 17.08.2024 21:24:31 ******/
CREATE NONCLUSTERED INDEX [IX_KullaniciEtkinliks_EtkinlikId] ON [dbo].[KullaniciEtkinliks]
(
	[EtkinlikId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Kullanicis_KullaniciAdi]    Script Date: 17.08.2024 21:24:31 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Kullanicis_KullaniciAdi] ON [dbo].[Kullanicis]
(
	[KullaniciAdi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Etkinliks]  WITH CHECK ADD  CONSTRAINT [FK_Etkinliks_Kullanicis_OlusturanKullaniciId] FOREIGN KEY([OlusturanKullaniciId])
REFERENCES [dbo].[Kullanicis] ([Id])
GO
ALTER TABLE [dbo].[Etkinliks] CHECK CONSTRAINT [FK_Etkinliks_Kullanicis_OlusturanKullaniciId]
GO
ALTER TABLE [dbo].[KullaniciEtkinliks]  WITH CHECK ADD  CONSTRAINT [FK_KullaniciEtkinliks_Etkinliks_EtkinlikId] FOREIGN KEY([EtkinlikId])
REFERENCES [dbo].[Etkinliks] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[KullaniciEtkinliks] CHECK CONSTRAINT [FK_KullaniciEtkinliks_Etkinliks_EtkinlikId]
GO
ALTER TABLE [dbo].[KullaniciEtkinliks]  WITH CHECK ADD  CONSTRAINT [FK_KullaniciEtkinliks_Kullanicis_KullaniciId] FOREIGN KEY([KullaniciId])
REFERENCES [dbo].[Kullanicis] ([Id])
GO
ALTER TABLE [dbo].[KullaniciEtkinliks] CHECK CONSTRAINT [FK_KullaniciEtkinliks_Kullanicis_KullaniciId]
GO
USE [master]
GO
ALTER DATABASE [CalenderAppDb] SET  READ_WRITE 
GO
