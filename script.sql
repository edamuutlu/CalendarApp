USE [CalenderAppDb]
GO
/****** Object:  User [PC_4172_ADMIN\PC_4172]    Script Date: 2024-08-15 10:36:35 ******/
CREATE USER [PC_4172_ADMIN\PC_4172] FOR LOGIN [PC_4172_ADMIN\PC_4172] WITH DEFAULT_SCHEMA=[PC_4172_ADMIN\PC_4172]
GO
/****** Object:  Schema [PC_4172_ADMIN\PC_4172]    Script Date: 2024-08-15 10:36:35 ******/
CREATE SCHEMA [PC_4172_ADMIN\PC_4172]
GO
/****** Object:  Table [PC_4172_ADMIN\PC_4172].[__EFMigrationsHistory]    Script Date: 2024-08-15 10:36:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [PC_4172_ADMIN\PC_4172].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [PC_4172_ADMIN\PC_4172].[Etkinliks]    Script Date: 2024-08-15 10:36:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [PC_4172_ADMIN\PC_4172].[Etkinliks](
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
/****** Object:  Table [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks]    Script Date: 2024-08-15 10:36:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks](
	[EtkinlikId] [int] NOT NULL,
	[KullaniciId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_KullaniciEtkinliks] PRIMARY KEY CLUSTERED 
(
	[KullaniciId] ASC,
	[EtkinlikId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [PC_4172_ADMIN\PC_4172].[Kullanicis]    Script Date: 2024-08-15 10:36:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [PC_4172_ADMIN\PC_4172].[Kullanicis](
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
INSERT [PC_4172_ADMIN\PC_4172].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240523111052_mig_01', N'8.0.5')
INSERT [PC_4172_ADMIN\PC_4172].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240716123457_12', N'8.0.5')
GO
SET IDENTITY_INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ON 

INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (175, N'deneme 1', N'deneme 1', CAST(N'2024-08-06T09:18:11.7040000' AS DateTime2), CAST(N'2024-08-06T10:18:11.7040000' AS DateTime2), 2, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (176, N'deneme 2', N'deneme 2', CAST(N'2024-08-07T10:19:41.3850000' AS DateTime2), CAST(N'2024-08-09T09:19:41.3000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (178, N'deneme 4', N'deneme 4', CAST(N'2024-08-14T10:20:06.0230000' AS DateTime2), CAST(N'2024-08-14T11:20:06.0230000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (179, N'deneme 5', N'deneme 5', CAST(N'2024-08-14T17:20:16.3000000' AS DateTime2), CAST(N'2024-08-16T18:20:16.3000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (180, N'deneme 3', N'deneme 3', CAST(N'2024-08-07T06:00:48.1000000' AS DateTime2), CAST(N'2024-08-07T07:00:48.1000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (181, N'deneme 6', N'deneme 6', CAST(N'2024-08-07T20:59:14.7000000' AS DateTime2), CAST(N'2024-08-07T21:59:14.7000000' AS DateTime2), 3, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (182, N'deneme 7', N'deneme 7', CAST(N'2024-08-24T15:59:14.7000000' AS DateTime2), CAST(N'2024-08-26T16:59:14.7000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
SET IDENTITY_INSERT [PC_4172_ADMIN\PC_4172].[Etkinliks] OFF
GO
INSERT [PC_4172_ADMIN\PC_4172].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'33a4f755-a60c-4e39-b100-a1da2510fc47', N'murat', N'murat', N'murat', N'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=')
INSERT [PC_4172_ADMIN\PC_4172].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'424f5c1c-f9f4-4004-873f-416c80762db5', N'eda', N'eda', N'eda', N'UA4wchoHAv07kCR7KNNSNh990R3GlWe3TXfS4KRZX+g=')
INSERT [PC_4172_ADMIN\PC_4172].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'851038f7-e17e-4549-92a2-e262c07b2b2e', N'admin', N'admin', N'admin', N'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=')
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[Etkinliks]  WITH CHECK ADD  CONSTRAINT [FK_Etkinliks_Kullanicis_OlusturanKullaniciId] FOREIGN KEY([OlusturanKullaniciId])
REFERENCES [PC_4172_ADMIN\PC_4172].[Kullanicis] ([Id])
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[Etkinliks] CHECK CONSTRAINT [FK_Etkinliks_Kullanicis_OlusturanKullaniciId]
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks]  WITH CHECK ADD  CONSTRAINT [FK_KullaniciEtkinliks_Etkinliks_EtkinlikId] FOREIGN KEY([EtkinlikId])
REFERENCES [PC_4172_ADMIN\PC_4172].[Etkinliks] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks] CHECK CONSTRAINT [FK_KullaniciEtkinliks_Etkinliks_EtkinlikId]
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks]  WITH CHECK ADD  CONSTRAINT [FK_KullaniciEtkinliks_Kullanicis_KullaniciId] FOREIGN KEY([KullaniciId])
REFERENCES [PC_4172_ADMIN\PC_4172].[Kullanicis] ([Id])
GO
ALTER TABLE [PC_4172_ADMIN\PC_4172].[KullaniciEtkinliks] CHECK CONSTRAINT [FK_KullaniciEtkinliks_Kullanicis_KullaniciId]
GO
