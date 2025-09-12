import {
  CellStatus,
  ChurchStatus,
  Gender,
  MemberType,
  PrismaClient,
  ProcessLevel,
  Role,
} from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
  const ADMIN_CLERK_USER_ID = process.env.ADMIN_CLERK_USER_ID as string;

  if (!ADMIN_EMAIL || !ADMIN_CLERK_USER_ID) {
    console.log("Cannot proceed without the Admin email and user id");
    return;
  }

  await prisma.$transaction(
    async (ctx) => {
      // create admin
      const admin = await ctx.user.create({
        data: {
          clerkId: ADMIN_CLERK_USER_ID,
          email: ADMIN_EMAIL,
          name: "GCC Admin",
          role: Role.ADMIN,
        },
      });

      if (!admin)
        throw new Error("Make sure the admin email is registered first");

      // create a disciple admin
      const adminAsDisciple = await ctx.disciple.create({
        data: {
          name: admin.name,
          address: "Morong, Rizal",
          birthdate: new Date("1996-03-12"),
          gender: Gender.MALE,
          memberType: MemberType.YOUNGPRO,
          processLevel: ProcessLevel.LEADERSHIP_3,
          cellStatus: CellStatus.REGULAR,
          churchStatus: ChurchStatus.REGULAR,
          userAccountId: admin.clerkId,
        },
        select: {
          id: true,
        },
      });

      // create pas j record
      const pasJ = await ctx.disciple.create({
        data: {
          name: "John De Guzman",
          address: "Morong, Rizal",
          birthdate: new Date("1970-08-08"),
          gender: Gender.MALE,
          memberType: MemberType.MEN,
          processLevel: ProcessLevel.LEADERSHIP_3,
          cellStatus: CellStatus.REGULAR,
          churchStatus: ChurchStatus.REGULAR,
          isPrimary: true,
          leaderId: adminAsDisciple.id,
        },
        select: {
          id: true,
        },
      });

      // insert the primary leaders
      const leaders = await ctx.disciple.createMany({
        data: [
          {
            name: "Daniel John Baja",
            address: "Morong, Rizal",
            birthdate: new Date("1996-03-12"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Chris Justine Bernardo",
            address: "Morong, Rizal",
            birthdate: new Date("1996-03-12"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Claudia Vanessa Quines",
            address: "Teresa, Rizal",
            birthdate: new Date("1996-03-12"),
            gender: "FEMALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Willy Anne Castelo",
            address: "Pililla, Rizal",
            birthdate: new Date("1996-03-12"),
            gender: "FEMALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Carlo C. Rosal",
            address: "Cardona, Rizal",
            birthdate: new Date("1996-03-29"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Leslie Henoguin Peña",
            address: "Morong, Rizal",
            birthdate: new Date("1997-10-24"),
            gender: "FEMALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Gary Peña",
            address: "Morong, Rizal",
            birthdate: new Date("1997-10-24"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Patrick Aerol Allauigan",
            address: "Tanay, Rizal",
            birthdate: new Date("1997-08-24"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Marvin Palabon",
            address: "Antipolo City",
            birthdate: new Date("1995-10-24"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Rosalinda Sahagun",
            address: "Morong, Rizal",
            birthdate: new Date("1995-10-24"),
            gender: "FEMALE",
            memberType: "WOMEN",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
          {
            name: "Eugene Ababa",
            address: "Tanay, Rizal",
            birthdate: new Date("1995-10-24"),
            gender: "MALE",
            memberType: "YOUNGPRO",
            processLevel: "LEADERSHIP_2",
            cellStatus: "REGULAR",
            churchStatus: "REGULAR",
            isPrimary: true,
            leaderId: pasJ.id,
          },
        ],
      });

      console.log("Created primary leaders: ", leaders.count);

      // seed series
      const series = await ctx.lessonSeries.createMany({
        data: [
          {
            title: "Soul Winning",
            description: "Lessons for Soul-Winning or Evangelism",
            tags: ["gospel", "soul-winning", "evangelism"],
          },
          {
            title: "Consolidation",
            description: "Follow-up lessons for new believers (Luke 15)",
            tags: ["discipleship"],
          },
          {
            title: "Discipleship 101",
            description: "In-depth discipleship lessons for closed cells",
            tags: ["discipleship", "doctrines"],
          },
          {
            title: "The Three Stages of Redemption",
            description: "Truths about the redemption of the elect",
            tags: ["Christ", "redemption"],
          },
        ],
      });

      console.log("Created Lesson Series: ", series.count);

      // get the series ids
      const seriesIds = await ctx.lessonSeries.findMany({
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // add lessons for each series
      const a = await ctx.lesson.createMany({
        data: [
          {
            title: "The Love of God",
            scriptureReferences: ["John 3:16"],
            lessonSeriesId: seriesIds[0].id,
          },
          {
            title: "Saved By Grace",
            scriptureReferences: ["Ephesians 2:8-9"],
            lessonSeriesId: seriesIds[0].id,
          },
          {
            title: "From Death to Life",
            scriptureReferences: ["Romans 6:23"],
            lessonSeriesId: seriesIds[0].id,
          },
          {
            title: "Gift of No Condemnation",
            scriptureReferences: ["Romans 8:1"],
            lessonSeriesId: seriesIds[0].id,
          },
        ],
      });

      const b = await ctx.lesson.createMany({
        data: [
          {
            title: "Returning to the Father",
            scriptureReferences: ["Luke 15"],
            lessonSeriesId: seriesIds[1].id,
          },
          {
            title: "The Father's Love",
            scriptureReferences: ["Luke 15"],
            lessonSeriesId: seriesIds[1].id,
          },
          {
            title: "The Father Has Something For You",
            scriptureReferences: ["Luke 15"],
            lessonSeriesId: seriesIds[1].id,
          },
          {
            title: "Son, Not Servant",
            scriptureReferences: ["Luke 15"],
            lessonSeriesId: seriesIds[1].id,
          },
          {
            title: "Talk to Your Father",
            scriptureReferences: ["Luke 15"],
            lessonSeriesId: seriesIds[1].id,
          },
        ],
      });

      const c = await ctx.lesson.createMany({
        data: [
          {
            title: "God's Saving Grace",
            scriptureReferences: ["Ephesians 2:8-9"],
            lessonSeriesId: seriesIds[2].id,
          },
          {
            title: "Justification by Faith",
            scriptureReferences: ["Romans 4:1-6", "Romans 3:20-21"],
            lessonSeriesId: seriesIds[2].id,
          },
          {
            title: " Justification: Accounting",
            scriptureReferences: ["Romans 4:1-6", "Romans 3:20-21"],
            lessonSeriesId: seriesIds[2].id,
          },
          {
            title: "New Birth",
            scriptureReferences: ["John 3:3-7"],
            lessonSeriesId: seriesIds[2].id,
          },
          {
            title: "Passover",
            scriptureReferences: ["Exodus 12"],
            lessonSeriesId: seriesIds[2].id,
          },
        ],
      });

      const d = await ctx.lesson.createMany({
        data: [
          {
            title: "The Three Stages of Redemption: Overview",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Three Stages of Redemption: Weakness Stage",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Price of Intimacy",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Price of a Servant",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Perfect Offering - Part 1",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Perfect Offering - Part 2",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Perfect Offering - Part 3",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Perfect Offering - Part 4",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "Sickness Stage - Part 1",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "Sickness Stage - Part 2",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Crown of Thorns : Sickness Stage - Part 3",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "Restored Dominion : Sickness Stage - Part 4",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
          {
            title: "The Substitute",
            lessonSeriesId: seriesIds[3].id,
            scriptureReferences: ["1 Corinthians 11:24-30"],
          },
        ],
      });

      console.log(`Created lessons for ${seriesIds[0].title}`, a.count);
      console.log(`Created lessons for ${seriesIds[1].title}`, b.count);
      console.log(`Created lessons for ${seriesIds[2].title}`, c.count);
      console.log(`Created lessons for ${seriesIds[3].title}`, d.count);

      // level 1
      await ctx.processLessonSeries.create({
        data: {
          title: "Leadership 1",
          description: "Collection of lessons for Leadership Level 1",
          tags: ["GPS", "Training", "Leadership"],
          processLevel: "LEADERSHIP_1",
          lessons: {
            createMany: {
              data: [
                {
                  title: "L1: The Truth About The Holy Bible",
                  fileUrl:
                    "https://drive.google.com/file/d/1lSt8_9ek9RRS28MxfDbJjAaH5WpjLtC5/view",
                },
                {
                  title: "L2: The Truth About God",
                  fileUrl:
                    "https://drive.google.com/file/d/1-nXNUylT5RzDi8TPXy-hL3R3Ss0RZWtc/view?usp=drivesdk",
                },
                {
                  title: "L3: 3x3 Prayer",
                  fileUrl:
                    "https://drive.google.com/file/d/1_ZK1WD58MgkbwIbH0oOVQYHhotq-tbrn/view?usp=drivesdk",
                },
                {
                  title: "L4: The Abundance of Grace",
                  fileUrl:
                    "https://drive.google.com/file/d/1uI-Pg8tKNhZi_I26flLF6ICOyZSAYoEs/view?usp=drivesdk",
                },
                {
                  title: "L5: Faith",
                  fileUrl:
                    "https://drive.google.com/file/d/1EZ0VysQiu8G8Dk1gDwaE_trW6wIQMMdu/view?usp=drivesdk",
                },
                {
                  title: "L6: True Repentance",
                  fileUrl:
                    "https://drive.google.com/file/d/1UOuH6AjIRauo1-wFIBIUZDrIFHhCTqOG/view?usp=drivesdk",
                },
                {
                  title: "L7: New Life in Christ",
                  fileUrl:
                    "https://drive.google.com/file/d/1XYB6Rz9nQwkHJDiQMIsn9wQBwU_Aftkk/view?usp=drivesdk",
                },
                {
                  title: "L8: The Truth About Water Baptism",
                  fileUrl:
                    "https://drive.google.com/file/d/1XYzkZOs8VIMuDoWGKRRDR1s_jo0QyjWH/view?usp=drivesdk",
                },
                {
                  title: "L9: The Truth About The Holy Spirit",
                  fileUrl:
                    "https://drive.google.com/file/d/1XaM6F9-QGpHJWDWo59V9kc0W068LcFuC/view?usp=drivesdk",
                },
                {
                  title: "L10: Overcoming The Devil",
                  fileUrl:
                    "https://drive.google.com/file/d/1l-HgKpZRRroJMOdctQzAjOIaLlgYqLPu/view?usp=drive_link",
                },
              ],
            },
          },
        },
      });

      console.log("Created Process Lessons for Level 1");

      // level 1
      await ctx.processLessonSeries.create({
        data: {
          title: "Leadership 2",
          description: "Collection of lessons for Leadership Level 2",
          tags: ["GPS", "Training", "Leadership"],
          processLevel: "LEADERSHIP_2",
          lessons: {
            createMany: {
              data: [
                {
                  title: "L0: Orientation",
                  fileUrl:
                    "https://drive.google.com/file/d/1L_zctFNU_RnQIomJOKO4HzVIkoqwA0E0/view?usp=drivesdk",
                },
                {
                  title: "L1a: The Heart Of A Leader",
                  fileUrl:
                    "https://drive.google.com/file/d/1qNb4xU5iz-WjW6WXLDJ1IIcOKRa_415c/view?usp=drivesdk",
                },
                {
                  title: "L1b: The 4W's Of A Cell Group",
                  fileUrl:
                    "https://drive.google.com/file/d/1infQBbNPfMCx5Xr0QRcEjolDJFtG-AFU/view?usp=drivesdk",
                },
                {
                  title: "L2: Soul Winning Through The 3x3 Prayer",
                  fileUrl:
                    "https://drive.google.com/file/d/1i04xAkdA6fPJPIc2T00Fu6pjEGXacc1o/view?usp=drivesdk",
                },
                {
                  title: "L3a: A Leader Prays",
                  fileUrl:
                    "https://drive.google.com/file/d/154pvYvMIkBwZLAVtlAe2iSguNSb4xsFs/view?usp=drivesdk",
                },
                {
                  title: "L3b: Building Relationship with the New Believer",
                  fileUrl:
                    "https://drive.google.com/file/d/10jABoIRuXC7Sf1Pcg4D99yJrRKlcE23-/view?usp=drivesdk",
                },
                {
                  title: "L4: The Four Important Aspects of Leadership",
                  fileUrl:
                    "https://drive.google.com/file/d/1GWpE9N2rRqe8INHRXxigmbwGMu3jHyBB/view?usp=drivesdk",
                },
                {
                  title: "L5: The Qualities of a Leader",
                  fileUrl:
                    "https://drive.google.com/file/d/1xgtwVpV39L1m0VGOn8-uKyru0-_MZDwP/view?usp=drivesdk",
                },
                {
                  title: "L6: Prayer as preparation for Soul winning",
                  fileUrl:
                    "https://drive.google.com/file/d/1kzizw3ICLd-05L3UOHzgdR7l3ax2PaLj/view?usp=drivesdk",
                },
                {
                  title: "L7: Praying For Your Disciples",
                  fileUrl:
                    "https://drive.google.com/file/d/1bcP8oh_-Rmoctrd-6JkakzQRp-ms-uwV/view?usp=drivesdk",
                },
                {
                  title: "L8: The Seed-Growing Prayer",
                  fileUrl:
                    "https://drive.google.com/file/d/1MK-v2_BxDJuwlSY-Q-Qi8JVV0MFQJuo9/view?usp=drivesdk",
                },
                {
                  title: "L9: Spiritual Warfare",
                  fileUrl:
                    "https://drive.google.com/file/d/1OXG5CPuKbum3iCTJgm7jVevmjO80VUJC/view?usp=drivesdk",
                },
                {
                  title: "L10: Appointed To Be Fruitful",
                  fileUrl:
                    "https://drive.google.com/file/d/1XY_nPChEkUbmRwqWtmCnCIRl9W5hB3I9/view?usp=drivesdk",
                },
              ],
            },
          },
        },
      });

      console.log("Created Process Lessons for Level 2");

      // level 3
      await ctx.processLessonSeries.create({
        data: {
          title: "Leadership 3",
          description: "Collection of lessons for Leadership Level 3",
          tags: ["GPS", "Training", "Leadership"],
          processLevel: "LEADERSHIP_3",
          lessons: {
            createMany: {
              data: [
                {
                  title: "L0: An Introduction To Spiritual Gifts",
                  fileUrl:
                    "https://drive.google.com/file/d/123fCsp7pYzTCRs0mBOWu8UMAYpBSBHUE/view?usp=drive_link",
                },
                {
                  title: "L1a: The Word Of Knowledge",
                  fileUrl:
                    "https://docs.google.com/presentation/d/1Fupak_WARrxVlAADVveQw7PlkZhBsHam/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
                },
                {
                  title: "L1b: The Word Of Wisdom",
                  fileUrl:
                    "https://docs.google.com/presentation/d/1Fupak_WARrxVlAADVveQw7PlkZhBsHam/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
                },
                {
                  title: "L2: The Gift Of Faith",
                  fileUrl:
                    "https://drive.google.com/file/d/1eRrhEl3Y_nATV_3GrJx6dpO-Mi4fMGTK/view?usp=drive_link",
                },
                {
                  title: "L3: The Gifts Of Healing",
                  fileUrl:
                    "https://drive.google.com/file/d/1HJ-xDyXKNCbrI8INqOK5UzZzBGDVmlEH/view?usp=drive_link",
                },
                {
                  title: "L4: The Working Of Miracles",
                  fileUrl:
                    "https://drive.google.com/file/d/14zSyh3D8H6nAm0U55rLG6HyGvOfOIgRB/view?usp=drive_link",
                },
                {
                  title: "L5: The Gift Of Prophecy",
                  fileUrl:
                    "https://docs.google.com/presentation/d/19jI_q0QJthVgss_cnqRCaa6sprPtcE8I/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
                },
                {
                  title:
                    "L6: The Gift of Tongues And The Interpretation of Tongues",
                  fileUrl:
                    "https://drive.google.com/file/d/14j30c1uIU2h91a_oilLwW8tZTTdRtSIH/view?usp=drive_link",
                },
              ],
            },
          },
        },
      });

      console.log("Created Process Lessons for Level 3");

      console.log("Success!");
    },
    { timeout: 15000 },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }

    await prisma.$disconnect();
    process.exit(1);
  });
