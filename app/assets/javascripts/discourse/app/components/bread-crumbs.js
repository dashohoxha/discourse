import Component from "@ember/component";
import { filter } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import deprecated from "discourse-common/lib/deprecated";
import discourseComputed from "discourse-common/utils/decorators";

//  A breadcrumb including category drop downs
export default Component.extend({
  site: service(),
  classNameBindings: ["hidden:hidden", ":category-breadcrumb"],
  tagName: "ol",
  editingCategory: false,
  editingCategoryTab: null,

  @discourseComputed("category.ancestors", "noSubcategories")
  categoryBreadcrumbs(categoryAncestors, noSubcategories) {
    const filteredCategories = this.site.categories.filter(
      (category) =>
        this.siteSettings.allow_uncategorized_topics ||
        category.id !== this.site.uncategorized_category_id
    );

    categoryAncestors = categoryAncestors || [];
    const parentCategories = [undefined, ...categoryAncestors];
    const categories = [...categoryAncestors, undefined];
    const zipped = parentCategories.map((x, i) => [x, categories[i]]);

    return zipped.map((record) => {
      const [parentCategory, category] = record;

      const options = filteredCategories.filter(
        (c) =>
          c.get("parentCategory.id") === (parentCategory && parentCategory.id)
      );

      return {
        category,
        parentCategory,
        options,
        isSubcategory: !!parentCategory,
        noSubcategories: !category && noSubcategories,
        hasOptions: !parentCategory || parentCategory.has_children,
      };
    });
  },

  @discourseComputed("siteSettings.tagging_enabled", "editingCategory")
  showTagsSection(taggingEnabled, editingCategory) {
    return taggingEnabled && !editingCategory;
  },

  @discourseComputed("category")
  parentCategory(category) {
    deprecated(
      "The parentCategory property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.parentCategory" }
    );
    return category && category.parentCategory;
  },

  parentCategories: filter("categories", function (c) {
    deprecated(
      "The parentCategories property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.parentCategories" }
    );
    if (
      c.id === this.site.get("uncategorized_category_id") &&
      !this.siteSettings.allow_uncategorized_topics
    ) {
      // Don't show "uncategorized" if allow_uncategorized_topics setting is false.
      return false;
    }

    return !c.get("parentCategory");
  }),

  @discourseComputed("parentCategories")
  parentCategoriesSorted(parentCategories) {
    deprecated(
      "The parentCategoriesSorted property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.parentCategoriesSorted" }
    );
    if (this.siteSettings.fixed_category_positions) {
      return parentCategories;
    }

    return parentCategories.sortBy("totalTopicCount").reverse();
  },

  @discourseComputed("category")
  hidden(category) {
    return this.site.mobileView && !category;
  },

  @discourseComputed("category", "parentCategory")
  firstCategory(category, parentCategory) {
    deprecated(
      "The firstCategory property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.firstCategory" }
    );
    return parentCategory || category;
  },

  @discourseComputed("category", "parentCategory")
  secondCategory(category, parentCategory) {
    deprecated(
      "The secondCategory property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.secondCategory" }
    );
    return parentCategory && category;
  },

  @discourseComputed("firstCategory", "hideSubcategories")
  childCategories(firstCategory, hideSubcategories) {
    deprecated(
      "The childCategories property of the bread-crumbs component is deprecated",
      { id: "discourse.breadcrumbs.childCategories" }
    );
    if (hideSubcategories) {
      return [];
    }

    if (!firstCategory) {
      return [];
    }

    return this.categories.filter(
      (c) => c.get("parentCategory") === firstCategory
    );
  },
});
